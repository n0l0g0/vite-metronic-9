import { Fragment } from 'react';
import { CreateTeam } from '@/partials/common/create-team';
import { toAbsoluteUrl } from '@/lib/helpers';
import { Highlights, Teams } from '..';

export function Demo4Content() {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <div className="grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch">
        <div className="lg:col-span-2">
          <CreateTeam
            image={
              <Fragment>
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
              </Fragment>
            }
            className="h-full"
            title="Swift Setup for New Teams"
            subTitle={
              <Fragment>
                Enhance team formation and management with easy-to-use tools for
                communication,
                <br />
                task organization, and progress tracking, all in one place.
              </Fragment>
            }
            engage={{
              path: '/public-profile/teams',
              label: 'Create Team',
              btnColor: 'primary',
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
    </div>
  );
}
