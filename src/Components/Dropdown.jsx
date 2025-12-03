import { useState } from "react";

export const Dropdown = ({item, list, setSelectedItem}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const onMenuClick = (listItem) => {
    setSelectedItem(listItem);
    setShowDropdown(false);
  };

  return (
    <div
      class="relative z-10 inline-block items-center"
      onMouseOver={(e) => {
        setShowDropdown(true);
      }}
      onMouseLeave={(e) => {
        setShowDropdown(false);
      }}
    >
      <div class="cursor-pointer rounded-full bg-upload-bg px-4 py-2.5 text-primary-text transition-all duration-200 ease-in-out select-none hover:bg-primary">
        Version: {item} <span class="text-[0.5rem]">▼</span>
      </div>

      <div
        class={`absolute top-full left-1/2 -translate-x-1/2 scale-75 transition-all duration-200 ease-in-out ${showDropdown ? "scale-100 opacity-100" : "pointer-events-none scale-75 opacity-0"}`}
      >
        <div class="my-2.5 w-full"></div>
        <div class={`rounded-2xl bg-upload-bg px-3 py-2`}>
          {list.map((listItem, index) => {
            return (
              <div
                key={index}
                class="my-1 w-full cursor-pointer rounded-full bg-upload-bg px-4 py-2 text-nowrap text-primary-text transition-all duration-200 ease-in-out hover:bg-primary"
                onClick={() => onMenuClick(listItem)}
              >
                {listItem}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
