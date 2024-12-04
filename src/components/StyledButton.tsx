import { Button } from "@mui/material";


interface StyledButtonProps {
  text: string;
  onClick: () => void;
  styleType: "primary" | "secondary" | "danger" | "success";
  variant?: "contained" | "outlined" | "text";
  className?: string;
}

const StyledButton = ({
  text,
  onClick,
  className,
  styleType,
  variant = "contained",
}: StyledButtonProps) => {
  return (
    <Button
      sx={{ paddingY: "5px" }}
      className={`text-white ${className}`}
      variant={variant}
      color={styleType}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
