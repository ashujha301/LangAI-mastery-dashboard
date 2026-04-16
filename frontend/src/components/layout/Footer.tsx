export default function Footer() {
  return (
    <footer className="pt-4 border-t border-border text-center">
      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} LangGraph Mastery Hub. Built with ♥ using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-foreground transition-colors"
        >
          caffeine.ai
        </a>
      </p>
    </footer>
  );
}
