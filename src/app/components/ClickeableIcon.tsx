import { MouseEventHandler } from "react";

interface ClickeableIconProps {
  icon: React.ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const ClickeableIcon = ({ icon, onClick }: ClickeableIconProps) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center rounded-full p-2 hover:bg-secondaryBackground 
                transition duration-300 focus:outline-none active:ring-2 
                active:ring-offset-2 active:ring-secondaryBackground active:transition active:duration-300"
    >
      {icon}
    </button>
  );
};

export default ClickeableIcon;