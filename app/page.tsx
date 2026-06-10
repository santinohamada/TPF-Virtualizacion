"use client"

import { useState, useEffect } from "react"
import { FileDown, BookOpen, Server, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProfileHeader } from "@/components/profile-header"
import { InfrastructureCard } from "@/components/infrastructure-card"
import { BlogPostCard, type BlogPost } from "@/components/blog-post-card"
import { NewPostForm } from "@/components/new-post-form"

export default function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Carga inicial de publicaciones desde PostgreSQL
  useEffect(() => {
    async function loadPosts() {
      try {
        const response = await fetch(`/api/posts?t=${Date.now()}`, { cache: "no-store" })
        if (response.ok) {
          const data = await response.json()
          setPosts(data)
        } else {
          console.error("Error al cargar posts desde el servidor")
        }
      } catch (error) {
        console.error("Error de red al cargar posts:", error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [])

  // Publicar un nuevo post vía POST /api/posts
  const handlePublish = async (titulo: string, contenido: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: titulo, content: contenido }),
      })

      if (response.ok) {
        const nuevoPost = await response.json()
        setPosts((prevPosts) => [nuevoPost, ...prevPosts])
        return true
      } else {
        console.error("Error al publicar en la base de datos")
        return false
      }
    } catch (error) {
      console.error("Error de red al publicar:", error)
      return false
    }
  }

  // Eliminar un post vía DELETE /api/posts?id=...
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id))
      } else {
        console.error("Error al eliminar el post de la base de datos")
      }
    } catch (error) {
      console.error("Error de red al eliminar:", error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 dark:from-slate-950 dark:to-slate-900 font-sans transition-colors duration-300">
      <main className="mx-auto max-w-4xl px-4 py-10 sm:py-16">

        {/* Contenedor Principal (Estilo Tarjeta Elevada) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">

          {/* Sección Superior: Header y Descarga */}
          <div className="p-6 sm:p-10 border-b border-slate-100 dark:border-slate-800">
            <ProfileHeader
              nombre="Hamada, Santino"
              dni="45.275.660"
              carrera="Ingeniería en Sistemas de Información - UTN FRT"
            />

            <div className="mt-8 flex justify-center sm:justify-start">
              <Button
                size="lg"
                className="w-full sm:w-auto gap-2 text-base font-medium shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
                asChild
              >
                <a href="https://tpf-virtualizacion.vercel.app/45275660/informe-tpf.pdf" download="Informe_TPF_Hamada_45275660.pdf">
                  <FileDown className="h-5 w-5" />
                  Descargar Informe Técnico (PDF)
                </a>
              </Button>
            </div>
          </div>

          <div className="p-6 sm:p-10 space-y-12">

            {/* Sección de Infraestructura */}
            <section>
              <div className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
                <Server className="h-6 w-6 text-blue-500" />
                <h3>Topología e Infraestructura LXC</h3>
              </div>

              {/* Grilla para mostrar ambos contenedores */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <div className="relative">
                    <InfrastructureCard
                      contenedor="45275660A (Blog Personal)"
                      ip="172.16.90.143"
                      recursos="128MB RAM / 1 CPU Core / 8GB"

                    />
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
                  <div className="relative">
                    <InfrastructureCard
                      contenedor="45275660DB (PostgreSQL)"
                      ip="172.16.90.144"
                      recursos="128MB RAM / 1 CPU Core / 8GB"

                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Separador */}
            <hr className="border-slate-200 dark:border-slate-800" />

            {/* Sección del Blog (Formulario + Feed) */}
            <section>
              <div className="mb-6 flex items-center gap-2 text-xl font-bold text-slate-800 dark:text-slate-100">
                <Layout className="h-6 w-6 text-blue-500" />
                <h3>Gestión del Blog</h3>
              </div>

              <div className="mb-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                <NewPostForm onPublish={handlePublish} />
              </div>

              <div className="flex items-center gap-2 text-lg font-semibold text-slate-700 dark:text-slate-300 mb-6">
                <BookOpen className="h-5 w-5 text-indigo-500" />
                Últimas Publicaciones
              </div>

              <div className="space-y-6 min-h-[200px]">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-slate-500">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-500"></div>
                    <p className="animate-pulse font-medium">Sincronizando con PostgreSQL (172.16.90.144)...</p>
                  </div>
                ) : posts.length === 0 ? (
                  <div className="py-16 text-center bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                      El feed está vacío. ¡Publica tu primer hito del proyecto!
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6">
                    {posts.map((post) => (
                      <BlogPostCard key={post.id} post={post} onDelete={handleDelete} />
                    ))}
                  </div>
                )}
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm font-medium text-slate-500 dark:text-slate-400">
          <p>
            © {new Date().getFullYear()} - Trabajo Práctico Final | UTN FRT
          </p>
          <p className="mt-1">Ingeniería en Sistemas de Información</p>
        </footer>
      </main>
    </div>
  )
}