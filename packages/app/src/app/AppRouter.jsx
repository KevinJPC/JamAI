import { Router as WouterRouter, Switch } from 'wouter'

import { HomeView } from '@/features/home/HomeView'
import { SearchView } from '@/features/search/SearchView'
import { SongView } from '@/features/song/SongView'
import { UserFavoriteSongsView } from '@/features/user-favorite-songs/UserFavoriteSongsView'
import { UserSettingsView } from '@/features/user-settings/UserSettingsView'
import { UserVersionsView } from '@/features/user-versions/UserVersionsView'
import { LogInForm } from '@/shared/auth/LogInForm'
import { BetterRoute } from '@/shared/components/BetterRoute'
import { Layout } from '@/shared/components/Layout'
import { PageNotFoundView } from '@/shared/components/PageNotFoundView'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { paths } from '@/shared/config/paths'

const routes = [
  {
    path: paths.home.path,
    element: () => <HomeView />
  },
  {
    path: '/login',
    element: () => <LogInForm goToSignUp='/signup' />
  },
  {
    path: paths.search.path,
    element: () => <SearchView />
  },
  {
    path: paths.chords.path,
    paramsParser: paths.chords.paramsParser,
    element: ({ params }) => {
      return <SongView songId={params.songId} />
    }
  },
  {
    path: paths.me.versions.path,
    element: () => (
      <ProtectedRoute>
        <UserVersionsView />
      </ProtectedRoute>
    )
  },
  {
    path: paths.me.favorites.path,
    element: () => (
      <ProtectedRoute>
        <UserFavoriteSongsView />
      </ProtectedRoute>
    )
  },
  {
    path: paths.me.path,
    element: () => (
      <ProtectedRoute>
        <UserSettingsView />
      </ProtectedRoute>
    )
  }
]

function wouterAroundNavigationHook (navigate, to, options) {
  navigate(to, options)
  if (!options.state?.preventScrollToTop) window.scrollTo(0, 0)
}

export const AppRouter = () => {
  return (
    <>
      <WouterRouter aroundNav={wouterAroundNavigationHook}>

        <Layout>
          <Switch>
            {routes.map(route => {
              return (
                <BetterRoute
                  key={route.path}
                  path={route.path}
                  paramsParser={route.paramsParser}
                >
                  {route.element}
                </BetterRoute>
              )
            })}

            <BetterRoute>
              <PageNotFoundView />
            </BetterRoute>
          </Switch>
        </Layout>
      </WouterRouter>
    </>
  )
}
