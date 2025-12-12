import logoImage from "@/assets/logo-salesflowia-new.png";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
}

const Logo = ({ size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-10",
    md: "h-14",
    lg: "h-20",
    xl: "h-28",
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
