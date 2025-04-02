import React, { useState } from "react";
import { Drawer } from "antd";
import { LeftCircleFilled } from "@ant-design/icons";
import FilterList from "./FilterList";

interface FilterDrawerProps {
  onApplyFilters: (filters: Record<string, string | undefined | number>) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ onApplyFilters }) => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  return (
    <>
      <div style={triggerStyle} onClick={showDrawer}>
        <LeftCircleFilled style={iconStyle} />
      </div>
      <Drawer
        title="Filter Options"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={300}
      >
        <FilterList onApplyFilters={onApplyFilters} />
      </Drawer>
    </>
  );
};

const triggerStyle: React.CSSProperties = {
  position: "fixed",
  top: "20%",
  right: 10, 
  transform: "translateY(-50%)",
  backgroundColor: "#fff",
  borderRadius: "50%",
  padding: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  cursor: "pointer",
  zIndex: 1000,
};

const iconStyle: React.CSSProperties = {
  fontSize: "24px",
  color: "#1890ff",
};

export default FilterDrawer;
