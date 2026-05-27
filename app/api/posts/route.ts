import { NextResponse } from "next/server"
import { Client } from "pg"

export const dynamic = "force-dynamic"

// Función auxiliar para obtener un cliente de base de datos limpio y configurado
function getDbClient() {
  return new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432", 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  })
}

// GET: Obtener todas las publicaciones ordenadas por created_at DESC
export async function GET() {
  const client = getDbClient()
  try {
    await client.connect()
    const result = await client.query(
      "SELECT id, title, content, created_at FROM posts ORDER BY created_at DESC"
    )

    // Mapeamos los campos de la base de datos al formato requerido por la interfaz
    const posts = result.rows.map((row) => ({
      id: row.id.toString(),
      titulo: row.title,
      fecha: new Date(row.created_at).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      extracto: row.content,
    }))

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    })
  } catch (error: any) {
    console.error("Error en GET /api/posts:", error)
    return NextResponse.json(
      { error: "Error al obtener las publicaciones de la base de datos" },
      { status: 500 }
    )
  } finally {
    // Cerramos explícitamente el hilo de conexión para evitar fugas de memoria en entornos con 128MB RAM
    await client.end()
  }
}

// POST: Crear una nueva publicación usando consultas preparadas de forma segura
export async function POST(request: Request) {
  const client = getDbClient()
  try {
    const body = await request.json()
    const { title, content } = body

    if (!title || !content) {
      return NextResponse.json(
        { error: "El título y el contenido son campos obligatorios" },
        { status: 400 }
      )
    }

    await client.connect()
    const result = await client.query(
      "INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING id, title, content, created_at",
      [title.trim(), content.trim()]
    )

    const newPost = result.rows[0]
    const mappedPost = {
      id: newPost.id.toString(),
      titulo: newPost.title,
      fecha: new Date(newPost.created_at).toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      extracto: newPost.content,
    }

    return NextResponse.json(mappedPost, { status: 201 })
  } catch (error: any) {
    console.error("Error en POST /api/posts:", error)
    return NextResponse.json(
      { error: "Error al insertar la publicación en la base de datos" },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}

// DELETE: Eliminar una publicación según su ID recibido por Query Parameter (?id=...)
export async function DELETE(request: Request) {
  const client = getDbClient()
  try {
    const { searchParams } = new URL(request.url)
    const idStr = searchParams.get("id")

    if (!idStr) {
      return NextResponse.json(
        { error: "El ID de la publicación es obligatorio" },
        { status: 400 }
      )
    }

    const id = parseInt(idStr, 10)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "El ID provisto no es un número válido" },
        { status: 400 }
      )
    }

    await client.connect()
    const result = await client.query(
      "DELETE FROM posts WHERE id = $1 RETURNING id",
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "No se encontró ninguna publicación con el ID especificado" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, message: "Publicación eliminada correctamente" })
  } catch (error: any) {
    console.error("Error en DELETE /api/posts:", error)
    return NextResponse.json(
      { error: "Error al eliminar la publicación en la base de datos" },
      { status: 500 }
    )
  } finally {
    await client.end()
  }
}
