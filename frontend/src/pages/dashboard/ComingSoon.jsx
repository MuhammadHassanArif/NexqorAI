import { Link } from "react-router-dom";
import { PageHeader } from "../../components/common/PageHeader";
import { EmptyState } from "../../components/common/EmptyState";
import { Button } from "../../components/ui/Button";
import { usePageTitle } from "../../hooks/usePageTitle";
import { ROUTES } from "../../constants/routes";

// Temporary page for dashboard sections that are not built yet, so no menu link leads nowhere.
export function ComingSoon({ title, description, icon }) {
  usePageTitle(`${title} | NexqorAI`);

  return (
    <div className="space-y-8">
      <PageHeader title={title} />
      <EmptyState
        icon={icon}
        title="Coming soon"
        description={description}
        action={
          <Button as={Link} to={ROUTES.dashboard} variant="soft">
            Back to overview
          </Button>
        }
      />
    </div>
  );
}