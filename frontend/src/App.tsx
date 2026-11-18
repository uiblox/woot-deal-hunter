import { useState } from 'react'
import {
  Alert, AppBar, Box, Card, CardActionArea, CardContent, CardMedia, Chip, Container, LinearProgress,
  Pagination, Stack, Tab, Tabs, Toolbar, Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import { FEEDS, formatPrice, type Feed } from './api'
import { useFeed } from './hooks'
import OfferDialog from './OfferDialog'

export default function App() {
  const [feed, setFeed] = useState<Feed>('All')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState<string | null>(null)
  const { data, isLoading, isFetching, error } = useFeed(feed, page)

  return (
    <>
      <AppBar position="sticky">
        <Toolbar><Typography variant="h6">Woot Deals</Typography></Toolbar>
        <Tabs value={feed} onChange={(_, v: Feed) => { setFeed(v); setPage(1) }} variant="scrollable" textColor="inherit" indicatorColor="secondary">
          {FEEDS.map((f) => <Tab key={f} value={f} label={f} />)}
        </Tabs>
        {isFetching && <LinearProgress color="secondary" />}
      </AppBar>
      <Container sx={{ py: 3 }}>
        {error && <Alert severity="error">{(error as Error).message}</Alert>}
        {isLoading && <LinearProgress />}
        <Grid container spacing={2}>
          {data?.Items?.map((o) => (
            <Grid key={o.OfferId} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
              <Card sx={{ height: '100%', opacity: o.IsSoldOut ? 0.6 : 1 }}>
                <CardActionArea onClick={() => setSelected(o.OfferId)} sx={{ height: '100%' }}>
                  {o.Photo && <CardMedia component="img" height="160" image={o.Photo} alt={o.Title} sx={{ objectFit: 'contain', p: 1 }} />}
                  <CardContent>
                    <Typography variant="subtitle2" sx={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{o.Title}</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "baseline", mt: 1 }}>
                      <Typography color="primary" sx={{ fontWeight: 700 }}>{formatPrice(o.SalePrice)}</Typography>
                      <Typography variant="caption" sx={{ textDecoration: 'line-through' }}>{formatPrice(o.ListPrice)}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} sx={{ mt: 1 }}>
                      {o.Condition && <Chip size="small" label={o.Condition} />}
                      {o.IsSoldOut && <Chip size="small" color="error" label="Sold out" />}
                    </Stack>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        {data?.TotalPages && data.TotalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination count={data.TotalPages} page={page} onChange={(_, p) => setPage(p)} />
          </Box>
        )}
      </Container>
      <OfferDialog offerId={selected} onClose={() => setSelected(null)} />
    </>
  )
}
