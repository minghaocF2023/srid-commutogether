import { Button } from "@mui/material";

interface StyledButtonProps {
  text: string;
  onClick: () => void;
  styleType: "primary" | "secondary" | "danger" | "success";
  variant?: "contained" | "outlined" | "text";
  className?: string;
  disabled?: boolean;
}

const StyledButton = ({
  text,
  onClick,
  className,
  styleType,
  disabled = false,
  variant = "contained",
}: StyledButtonProps) => {
  return (
    <Button
      sx={{ paddingY: "5px" }}
      className={`text-white ${className}`}
      variant={variant}
      // @ts-ignore
      color={styleType}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default StyledButton;
