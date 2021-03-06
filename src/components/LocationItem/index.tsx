import Link from "next/link";
import { FiEdit2, FiTrash } from "react-icons/fi";

import { api } from "../../services/apiClient";
import styles from "../../styles/common.module.scss";

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

  const preventRedirectionInButton = (e: any) => {
    const { target } = e;
    const { parentElement } = target;
    if (target.type === "button" || parentElement.type === "button") {
      e.preventDefault();
    }
  };

  return (
    <li className={styles.item}>
      <Link href={`/locais/${id}`} passHref>
        <a onClick={preventRedirectionInButton} href="pass">
          <p>{location}</p>
          <FiEdit2 className={styles.edit} width={18} />
          <button
            className={styles.buttonRed}
            onClick={removeEvent}
            type="button"
          >
            <FiTrash width={18} color="white" />
          </button>
        </a>
      </Link>
    </li>
  );
}

export { LocationItem };
