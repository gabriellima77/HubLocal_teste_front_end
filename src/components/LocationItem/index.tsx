import { FiEdit2, FiTrash } from "react-icons/fi";

import { api } from "../../services/apiClient";
import styles from "./LocationItem.module.scss";

interface LocationItemProps {
  location: string;
  company_id: string;
  id: string;
  onRemoveLocation(id: string): void;
}

function LocationItem({
  id,
  location,
  company_id,
  onRemoveLocation,
}: LocationItemProps) {
  const removeEvent = async () => {
    try {
      const { data } = await api.delete(`/locais/${id}`, {
        headers: { company_id },
      });
      onRemoveLocation(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className={styles.item}>
      <p>{location}</p>
      <FiEdit2 className={styles.edit} width={18} />
      <button onClick={removeEvent} type="button">
        <FiTrash width={18} color="white" />
      </button>
    </li>
  );
}

export { LocationItem };
