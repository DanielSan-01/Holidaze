export default function HeroSection({ 
  title, 
  subtitle, 
  className = "text-center py-16 px-4",
  titleClassName = "text-4xl font-bold mb-4",
  subtitleClassName = "text-xl text-gray-600 mb-8"
}) {
  return (
    <div className={className}>
      <h1 className={titleClassName}>{title}</h1>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
} 