import Link from "next/link";
import { FiEdit2, FiTrash } from "react-icons/fi";

import { api } from "../../services/apiClient";
import styles from "./CompanyItem.module.scss";

interface CompanyItemProps {
  company: string;
  id: string;
  removeCompany(id: string): void;
}

export function CompanyItem({ company, id, removeCompany }: CompanyItemProps) {
  const preventRedirectionInButton = (e: any) => {
    const { target } = e;
    const { parentElement } = target;
    if (target.type === "button" || parentElement.type === "button") {
      e.preventDefault();
    }
  };

  const onRemoveCompany = async () => {
    try {
      const { data } = await api.delete(`/empresas/${id}`);
      removeCompany(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <li className={styles.item}>
      <Link href={`/empresas/${id}`} passHref>
        <a onClick={preventRedirectionInButton} href="replace">
          <p>{company}</p>
          <FiEdit2 className={styles.edit} width={18} />
          <button onClick={onRemoveCompany} type="button">
            <FiTrash width={18} color="white" />
          </button>
        </a>
      </Link>
    </li>
  );
}
