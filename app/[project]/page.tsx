import ProjectBoardClient from './ProjectBoardClient';

export default async function ProjectPage({
  params
}: {
  params: Promise<{ project: string }>;
}) {
  const { project } = await params;
  return <ProjectBoardClient projectName={project} />;
}
