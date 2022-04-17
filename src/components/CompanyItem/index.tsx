import Link from "next/link";

interface CompanyItemProps {
  company: string;
  id: string;
}

export function CompanyItem({ company, id }: CompanyItemProps) {
  return (
    <li>
      <Link href={`empresas/${id}`} passHref>
        <a href="replace">
          <p>{company}</p>
          <button type="button">Editar</button>
          <button type="button">Remover</button>
        </a>
      </Link>
    </li>
  );
}
