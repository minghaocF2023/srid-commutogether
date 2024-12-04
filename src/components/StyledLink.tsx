import { Button } from "@mui/material";
import Link from "next/link";

interface StyledLinkProps {
  text: string;
  href: string | object;
  styleType: | "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning" | undefined;
  variant?: "contained" | "outlined" | "text";
  className?: string;
}

const StyledLink = ({
  text,
  href,
  className,
  styleType,
  variant = "contained",
}: StyledLinkProps) => {
  return (
    <Button
      sx={{ paddingY: "5px" }}
      className={`text-white ${className}`}
      variant={variant}
      color={styleType}
    >
      <Link href={href}>{text}</Link>
    </Button>
  );
};

export default StyledLink;
