import React, { useState } from "react";
import moment from "moment-jalaali";
import { Modal, Input, Button } from "antd";
import { Product } from "../../api/product";
import styles from "./EditProductModal.module.scss";

interface EditProductModalProps {
    visible: boolean;
    product: Product | null;
    onCancel: () => void;
    onSave: () => void;
    onChange: (key: string, value: string) => void;
}

const excludedFields = [
    "_id",
    "Main_data_status",
    "Extra_data_status",
    "picture_old",
    "picture_new",
    "picture_main_info",
    "picture_extra_info",
    "createdAt",
    "updatedAt",
    "__v",
];

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
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
        setImageModalVisible(true);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setImageModalVisible(false);
    };

    return (
        <>
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
                destroyOnClose
            >
                {product && (
                    <div className={styles.container}>
                        {/* Editable Fields */}
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

                            {/* Read-only Jalali Dates */}
                            {product.createdAt && (
                                <div className={styles.field}>
                                    <label>تاریخ ایجاد:</label>
                                    <Input
                                        value={moment(product.createdAt).format("jYYYY/jMM/jDD HH:mm")}
                                        readOnly
                                    />
                                </div>
                            )}
                            {product.updatedAt && (
                                <div className={styles.field}>
                                    <label>تاریخ بروزرسانی:</label>
                                    <Input
                                        value={moment(product.updatedAt).format("jYYYY/jMM/jDD HH:mm")}
                                        readOnly
                                    />
                                </div>
                            )}
                        </div>

                        {/* Product Images */}
                        <div className={styles.imagesContainer}>
                            {imageFields.map(({ key, label }) => (
                                <div key={key} className={styles.imageField}>
                                    <h4>{label}</h4>
                                    {product[key as keyof Product] ? (
                                        <img
                                            src={typeof product[key as keyof Product] === 'string' ? product[key as keyof Product] as string : undefined}
                                            alt={label}
                                            className={styles.image}
                                            onClick={() =>
                                                handleImageClick(product[key as keyof Product] as string)
                                            }
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                                const container = (e.target as HTMLElement).closest("div");
                                                if (container) {
                                                    container.innerHTML = "<p>No Image Available</p>";
                                                }
                                            }}
                                        />
                                    ) : (
                                        <p>No Image Available</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* Image Modal */}
            <Modal
                open={imageModalVisible}
                onCancel={closeImageModal}
                footer={null}
                width="40vw"
                centered
                destroyOnClose
            >
                {selectedImage && (
                    <img
                        src={selectedImage}
                        alt="Enlarged"
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "8px",
                        }}
                    />
                )}
            </Modal>
        </>
    );
};

export default EditProductModal;
