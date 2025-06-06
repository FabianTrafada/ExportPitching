import { getTemplateById } from "@/actions/admin.actions";
import DeleteTemplateForm from "./DeleteTemplateForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DeleteTemplatePage({ params }: PageProps) {
  const { id } = await params;
  const template = await getTemplateById(parseInt(id));

  return <DeleteTemplateForm initialTemplate={template || null} templateId={parseInt(id)} />;
} 