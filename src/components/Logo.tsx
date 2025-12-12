import logoImage from "@/assets/logo-salesflowia-white.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo = ({ size = "lg" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-16",
    md: "h-20",
    lg: "h-28",
    xl: "h-36",
  };

  return (
    <img 
      src={logoImage} 
      alt="SalesFlowIA" 
      className={`${sizeClasses[size]} w-auto object-contain`}
    />
  );
};

export default Logo;
