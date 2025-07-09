import { Fragment } from 'react';
import {
  Toolbar,
  ToolbarDescription,
  ToolbarHeading,
  ToolbarPageTitle,
} from '@/partials/common/toolbar';
import { useSettings } from '@/providers/settings-provider';
import { Container } from '@/components/common/container';
import { EngineContent } from './engine-content';

export function EnginePage() {
  const { settings } = useSettings();

  return (
    <Fragment>
      {settings?.layout === 'demo1' && (
        <Container>
          <Toolbar>
            <ToolbarHeading>
              <ToolbarPageTitle />
              <ToolbarDescription>
                <div className="flex items-center flex-wrap gap-1.5 font-medium">
                  <span className="text-base text-secondary-foreground">
                    All Engines:
                  </span>
                  <span className="text-base text-foreground font-medium me-2">
                    999
                  </span>
                  <span className="text-base text-secondary-foreground">
                    Active Engines
                  </span>
                  <span className="text-base text-foreground font-medium">
                    99
                  </span>
                </div>
              </ToolbarDescription>
            </ToolbarHeading>
          </Toolbar>
        </Container>
      )}
      <Container>
        <EngineContent />
      </Container>
    </Fragment>
  );
}
