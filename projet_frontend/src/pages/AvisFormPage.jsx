import { useParams } from "react-router-dom";
import AvisForm from "./AvisForm"; // comme ils sont dans le même dossier

export default function AvisFormPage() {
  const { id } = useParams();

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Laisser un avis</h1>
      <AvisForm etablissementId={id} />
    </div>
  );
}
