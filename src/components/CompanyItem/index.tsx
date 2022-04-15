import Link from "next/link";

interface CompanyItemProps {
  company: string;
  id: string;
}

export function CompanyItem({company, id}: CompanyItemProps) {
  return (
  <li>
    <Link href={`/${id}`}>
      <a>
        <p>{company}</p>
        <button>Editar</button>
        <button>Remover</button>
      </a>
    </Link>
  </li>
  );
}