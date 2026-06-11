import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Obtenemos la URL actual base para buscar el PDF
  const baseUrl = request.url;
  
  // Como Vercel sirve los estáticos desde la raíz (y Next.js mapea el basePath),
  // buscamos el PDF directamente desde la propia Vercel.
  const pdfUrl = new URL('/45275660/informe-tpf.pdf', baseUrl);
  
  try {
    const response = await fetch(pdfUrl.toString());
    
    if (!response.ok) {
      return new NextResponse('PDF not found', { status: 404 });
    }

    const blob = await response.blob();
    
    // Devolvemos el archivo forzando la descarga mediante la cabecera Content-Disposition
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Informe_TPF_Hamada_45275660.pdf"',
      },
    });
  } catch (error) {
    return new NextResponse('Error fetching PDF', { status: 500 });
  }
}
