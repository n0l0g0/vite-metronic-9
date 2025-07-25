import { Highlights, Teams } from '@/pages/dashboards/demo1';
import { ManageData } from '@/pages/dashboards/demo2/components';
import { CreateTeam } from '@/partials/common/create-team';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Integrations } from './components';

export function Demo3Content() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <CreateTeam
            image={
              <>
                <img
                  src={toAbsoluteUrl('/media/illustrations/32.svg')}
                  className="dark:hidden max-h-[180px]"
                  alt="image"
                />
                <img
                  src={toAbsoluteUrl('/media/illustrations/32-dark.svg')}
                  className="light:hidden max-h-[180px]"
                  alt="image"
                />
              </>
            }
            className="h-full"
            title="Swift Setup for New Teams"
            subTitle={
              <>
                Enhance team formation and management with easy-to-use tools for
                communication,
                <br />
                task organization, and progress tracking, all in one place.
              </>
            }
            engage={{
              path: '/public-profile/teams',
              label: 'Create Team',
              btnColor: 'mono',
            }}
          />
        </div>
        <div className="lg:col-span-1">
          <Highlights />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <Teams />
        </div>
      </div>
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <Integrations />
        </div>
        <div className="lg:col-span-1">
          <ManageData className="h-full" />
        </div>
      </div>
    </div>
  );
}
