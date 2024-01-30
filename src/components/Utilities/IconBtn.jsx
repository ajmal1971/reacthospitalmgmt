import { Icons } from "../../shared/AppEnum";

/* eslint-disable react/prop-types */
const IconBtn = ({
  children = "",
  icon = "",
  onClickEvent = null,
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      className={`rounded-md border border-blue-900 text-sm p-2 ${className}`}
      onClick={onClickEvent}
      {...props}
      disabled={isLoading || disabled}
      type={type}
    >
      <i
        className={isLoading ? Icons.spinner : icon}
        style={{
          fontSize: "1rem",
          color: "color: rgb(59 130 246)",
          fontWeight: "900",
        }}
      ></i>
      {children}
    </button>
  );
};

export default IconBtn;
