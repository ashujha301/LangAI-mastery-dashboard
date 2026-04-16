export default function Footer() {
  return (
    <footer className="pt-4 border-t border-border text-center">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} LangGraph Mastery Hub. Built with ♥
      </p>
    </footer>
  );
}
