import logoImage from "@/assets/logo-salesflowia-white.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo = ({ size = "xl" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-20",
    md: "h-28",
    lg: "h-40",
    xl: "h-52",
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
