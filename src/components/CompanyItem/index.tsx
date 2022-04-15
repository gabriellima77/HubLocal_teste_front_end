
interface CompanyItemProps {
  company: string;
  id: string;
}

export function CompanyItem({company, id}: CompanyItemProps) {
  return (
  <li>
    <p>{company}</p>
    <button>Editar</button>
    <button>Remover</button>
  </li>
  );
}