import { Button, Popover, Input } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { useData } from "../store/dataContext";
import { useState } from "react";

const FilterList: React.FC = () => {
    const { fetchData } = useData();
    const [importer, setImporter] = useState<string>("");

    const searchDataHandler = () => {
        try {
            fetchData({ page: "1", limit: "10", importer });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <div style={filterListStyle}>
            <div style={helpIconStyle}>
                <Popover content={PopoverContent} title="" trigger="hover">
                    <QuestionCircleOutlined />
                </Popover>
            </div>
            <span style={{ marginBottom: "20px" }}>جست و جو با فیلتر</span>
            <Input
                placeholder="نام واردکننده"
                value={importer}
                onChange={(e) => setImporter(e.target.value)}
                style={inputStyle}
            />
            <Button style={SearchButtonStyle} onClick={searchDataHandler}>
                جست و جو
            </Button>
        </div>
    );
};

const PopoverContent = (
    <div
        style={{
            fontSize: "18px",
        }}
    >
        برای برگشت تمام داده ها، بدون فیلتر جست و جو کنید
    </div>
);

const filterListStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: "100px",
    width: "20%",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    backgroundColor: "#f0f4f8",
    position: "relative",
    direction: 'rtl',
};

const helpIconStyle: React.CSSProperties = {
    position: "absolute",
    top: "10px",
    left: "10px",
    fontFamily: "Vazir",
};

const inputStyle: React.CSSProperties = {
    marginBottom: "10px",
    padding: "7px",
    fontSize: "16px",
    width: "100%",
    borderRadius: "10px",
    border: "1px solid #ccc",
};

const SearchButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#4682b4",
    color: "white",
    padding: "17px 30px",
    fontSize: "17px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginTop: "10px",
};

export default FilterList;
