import React, { useEffect, useState } from "react";
import moment from "moment-jalaali";
import { Modal, Input, Button, Select } from "antd";
import axios from "axios"; // Import axios for API calls
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
    const [clusters, setClusters] = useState<string[]>([]);
    const [childClusters, setChildClusters] = useState<string[]>([]);
    const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
    const [selectedChildCluster, setSelectedChildCluster] = useState<string | null>(null);

    useEffect(() => {
        if (visible) {
            axios
                .get("http://localhost:3000/api/distinct-clusters")
                .then((response) => {
                    if (response.data && Array.isArray(response.data.clusters)) {
                        const filteredClusters = response.data.clusters.filter(
                            (cluster: string) => cluster.trim() !== ""
                        );
                        setClusters(filteredClusters);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching clusters:", error);
                });
        }
    }, [visible]);

    // Fetch child clusters when a cluster is selected
    useEffect(() => {
        if (selectedCluster) {
            axios
                .get(`http://localhost:3000/api/distinct-child-clusters?cluster=${selectedCluster}`)
                .then((response) => {
                    if (response.data && Array.isArray(response.data.childClusters)) {
                        setChildClusters(response.data.childClusters);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching child clusters:", error);
                });
        } else {
            setChildClusters([]); // Reset child clusters if parent cluster is unselected
        }
    }, [selectedCluster]);

    const handleClusterChange = (value: string) => {
        setSelectedCluster(value);
        setSelectedChildCluster(null);
        onChange("cluster", value);
    };

    const handleChildClusterChange = (value: string) => {
        setSelectedChildCluster(value);
        onChange("child_cluster", value);
    };

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
                width="98vw"
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
                        <div className={styles.fieldsContainer}>
                            {Object.keys(product)
                                .filter((key) => !excludedFields.includes(key))
                                .map((key) => (
                                    <div key={key} className={styles.field}>
                                        <label>{key.replace(/_/g, " ")}:</label>
                                        {key === "cluster" ? (
                                            <Select
                                                value={selectedCluster || product[key] || undefined}
                                                onChange={handleClusterChange}
                                                style={{ width: "100%", direction: "rtl" }}
                                                dropdownStyle={{ direction: "rtl" }}
                                                placeholder="یک دسته‌بندی انتخاب کنید"
                                                showSearch
                                                filterOption={(input, option) => {
                                                    return option ? option.label.toLowerCase().includes(input.toLowerCase()) : false;
                                                }}
                                                options={clusters.map((cluster) => ({
                                                    value: cluster,
                                                    label: cluster,
                                                }))}
                                            />
                                        ) : key === "child_cluster" ? (
                                            <Select
                                                value={selectedChildCluster || product[key] || undefined}
                                                onChange={handleChildClusterChange}
                                                style={{ width: "100%", direction: "rtl" }}
                                                dropdownStyle={{ direction: "rtl" }}
                                                placeholder="یک زیر دسته‌بندی انتخاب کنید"
                                                disabled={!selectedCluster} // Disable if no parent cluster is selected
                                                showSearch
                                                filterOption={(input, option) => {
                                                    return option ? option.label.toLowerCase().includes(input.toLowerCase()) : false;
                                                }}
                                                options={childClusters.map((cluster) => ({
                                                    value: cluster,
                                                    label: cluster,
                                                }))}
                                            />
                                        ) : (
                                            <Input
                                                value={(product as any)[key]}
                                                onChange={(e) => onChange(key, e.target.value)}
                                            />
                                        )}
                                    </div>
                                ))}

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

                        <div className={styles.imagesContainer}>
                            {imageFields.map(({ key, label }) => (
                                <div key={key} className={styles.imageField}>
                                    <h4>{label}</h4>
                                    {product[key as keyof Product] ? (
                                        <img
                                            src={typeof product[key as keyof Product] === "string" ? product[key as keyof Product] as string : undefined}
                                            alt={label}
                                            className={styles.image}
                                            onClick={() => handleImageClick(product[key as keyof Product] as string)}
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
        </>
    );
};

export default EditProductModal;
