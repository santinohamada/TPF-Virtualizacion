import { Calendar, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export interface BlogPost {
  id: string
  titulo: string
  fecha: string
  extracto: string
}

interface BlogPostCardProps {
  post: BlogPost
  onDelete?: (id: string) => void
}

export function BlogPostCard({ post, onDelete }: BlogPostCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{post.titulo}</CardTitle>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {post.fecha}
            </div>
          </div>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => onDelete(post.id)}
              aria-label={`Eliminar publicación: ${post.titulo}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {post.extracto}
        </p>
      </CardContent>
    </Card>
  )
}
