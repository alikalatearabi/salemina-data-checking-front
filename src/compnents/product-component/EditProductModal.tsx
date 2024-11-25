import React from "react";
import { Modal, Input, Button, Tabs } from "antd";
import { Product } from "../../api/product";
import styles from "./EditProductModal.module.scss";

const { TabPane } = Tabs;

interface EditProductModalProps {
    visible: boolean;
    product: Product | null;
    onCancel: () => void;
    onSave: () => void;
    onChange: (key: string, value: string) => void;
}

// Fields to exclude from the editable fields tab
const excludedFields = [
    "_id",
    "Main_data_status",
    "Extra_data_status",
    "picture_old",
    "picture_new",
    "picture_main_info",
    "picture_extra_info",
    "updatedAt",
    "monitor",
    "importer",
];

// Fields for the images tab
const imageFields = [
    { key: "picture_old", label: "Old Picture" },
    { key: "picture_new", label: "New Picture" },
    { key: "picture_main_info", label: "Main Info Picture" },
    { key: "picture_extra_info", label: "Extra Info Picture" },
];

const EditProductModal: React.FC<EditProductModalProps> = ({
    visible,
    product,
    onCancel,
    onSave,
    onChange,
}) => {
    return (
        <Modal
            width="90vw"
            title="Edit Product"
            open={visible}
            onCancel={onCancel}
            footer={
                <div className={styles.modalFooter}>
                    <Button key="cancel" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button key="save" type="primary" onClick={onSave}>
                        Save
                    </Button>
                </div>
            }
        >
            {product && (
                <Tabs defaultActiveKey="1">
                    {/* Tab 1: Editable Fields */}
                    <TabPane tab="Edit Fields" key="1">
                        <div className={styles.fieldsContainer}>
                            {Object.keys(product)
                                .filter((key) => !excludedFields.includes(key))
                                .map((key) => (
                                    <div key={key} className={styles.field}>
                                        <label>{key.replace(/_/g, " ")}:</label>
                                        <Input
                                            value={(product as any)[key]}
                                            onChange={(e) => onChange(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                        </div>
                    </TabPane>

                    {/* Tab 2: Images */}
                    <TabPane tab="Product Images" key="2">
                        <div className={styles.imagesContainer}>
                            {imageFields.map(({ key, label }) => (
                                <div key={key} className={styles.imageField}>
                                    <h4>{label}</h4>
                                    {product[key as keyof Product] ? (
                                        <img
                                            src={product[key as keyof Product]}
                                            alt={label}
                                            className={styles.image}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                                const parentElement = (e.target as HTMLElement).parentElement;
                                                if (parentElement) {
                                                    parentElement.innerHTML = "<p>No Image Available</p>";
                                                }
                                            }}
                                        />
                                    ) : (
                                        <p>No Image Available</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </TabPane>
                </Tabs>
            )}
        </Modal>
    );
};

export default EditProductModal;
