import DraggableContact from './DraggableContact'

export default function Footer() {
  return (
    <footer id="contact" className="pt-16 pb-8 bg-white dark:bg-gray-900 w-full" suppressHydrationWarning>
      <div className="container max-w-[1440px] mx-auto px-4">
        <DraggableContact />
      </div>
    </footer>
  )
}

