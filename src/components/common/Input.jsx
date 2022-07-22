import React, { forwardRef } from "react";

const Input = forwardRef(({ ...rest }, ref) => {
  return (
    <input
      className="bg-gray-600 w-full outline-none border-[0.5px] border-gray-500 px-3 py-1 rounded-md mb-3"
      {...rest}
      ref={ref}
    />
  );
});

export default Input;
