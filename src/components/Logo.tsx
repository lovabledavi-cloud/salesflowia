import logoImage from "@/assets/logo-salesflowia-white.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

const Logo = ({ size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-10",
    md: "h-14",
    lg: "h-20",
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
