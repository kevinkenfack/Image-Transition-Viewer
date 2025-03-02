import { ImageCompare } from "@/components/image-compare"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <div className="max-w-5xl w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold">Image Transition Viewer</h1>
          <p className="text-muted-foreground">
            Compare light and dark versions of your images with smooth transitions
          </p>
        </div>

        <ImageCompare
          lightImage="/placeholder.svg?height=600&width=800"
          darkImage="/placeholder.svg?height=600&width=800"
        />
      </div>
    </main>
  )
}

