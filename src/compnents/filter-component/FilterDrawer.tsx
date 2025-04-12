import React, { useState } from "react";
import { Drawer, Badge } from "antd";
import { FilterOutlined, CloseOutlined } from "@ant-design/icons";
import FilterList from "./FilterList";

interface FilterDrawerProps {
  onApplyFilters: (filters: Record<string, string | undefined | number>) => void;
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({ onApplyFilters }) => {
  const [visible, setVisible] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const handleApplyFilters = (filters: Record<string, string | undefined | number>) => {
    // Count active filters (excluding undefined values)
    const count = Object.values(filters).filter(value => value !== undefined).length;
    setActiveFiltersCount(count);
    onApplyFilters(filters);
    
    // Optional: close drawer on small screens after applying filters
    if (window.innerWidth <= 768) {
      setVisible(false);
    }
  };

  return (
    <>
      <div className="filter-trigger" onClick={showDrawer} style={triggerStyle}>
        <Badge count={activeFiltersCount} size="small" offset={[-5, 5]}>
          <FilterOutlined style={iconStyle} />
        </Badge>
        <span style={filterTextStyle}>فیلترها</span>
      </div>
      
      <Drawer
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '18px', fontWeight: 600, color: '#1d3557' }}>
              فیلترهای پیشرفته
            </span>
            <Badge 
              count={activeFiltersCount} 
              size="small" 
              style={{ backgroundColor: activeFiltersCount ? '#457b9d' : '#ccc' }}
            />
          </div>
        }
        placement="right"
        onClose={onClose}
        open={visible}
        width={window.innerWidth > 768 ? 700 : '100%'}
        height="auto"
        styles={{
          header: { 
            borderBottom: '1px solid #f0f0f0', 
            padding: '16px 24px', 
            direction: 'rtl' 
          },
          body: { 
            padding: '0', 
            backgroundColor: '#f9fafb', 
            overflowY: 'auto', 
            maxHeight: 'calc(100vh - 100px)' 
          },
          mask: { 
            backgroundColor: 'rgba(0,0,0,0.4)' 
          },
          content: {
            maxWidth: '800px'
          }
        }}
        closeIcon={<CloseOutlined style={{ fontSize: '16px', color: '#666' }} />}
      >
        <FilterList onApplyFilters={handleApplyFilters} />
      </Drawer>
    </>
  );
};

const triggerStyle: React.CSSProperties = {
  position: "fixed",
  top: "120px",
  right: "20px",
  backgroundColor: "#ffffff",
  borderRadius: "30px",
  padding: "10px 16px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.12)",
  cursor: "pointer",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  transition: "all 0.3s ease",
  border: "1px solid #eaeaea",
  color: "#457b9d"
};

const iconStyle: React.CSSProperties = {
  fontSize: "18px",
  color: "#457b9d",
};

const filterTextStyle: React.CSSProperties = {
  fontSize: "14px",
  fontWeight: 500,
};

export default FilterDrawer;
