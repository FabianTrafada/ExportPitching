import { getTemplateById } from "@/actions/admin.actions";
import EditTemplateForm from "./EditTemplateForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTemplatePage({ params }: PageProps) {
  const { id } = await params;
  const template = await getTemplateById(parseInt(id));

  return <EditTemplateForm initialTemplate={template || null} />;
} 