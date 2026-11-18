import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material'
import { useGetOffers } from './hooks'
import { formatPrice } from './api'

export default function OfferDialog({ offerId, onClose }: { offerId: string | null; onClose: () => void }) {
  const { data, isLoading, error } = useGetOffers(offerId ? [offerId] : [])
  const offer = data?.[0]
  return (
    <Dialog open={!!offerId} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{offer?.Title ?? 'Offer details'}</DialogTitle>
      <DialogContent dividers>
        {isLoading && <CircularProgress />}
        {error && <Alert severity="error">{(error as Error).message}</Alert>}
        {offer && (
          <Box>
            {offer.Photos?.[0] && <Box component="img" src={offer.Photos[0].Url} alt="" sx={{ maxHeight: 260, maxWidth: '100%', mb: 2 }} />}
            {offer.Teaser && <Typography gutterBottom>{offer.Teaser}</Typography>}
            {offer.Items?.map((i) => (
              <Typography key={i.Id} variant="body2">
                {i.Title} — <b>{formatPrice(i.SalePrice)}</b> (list {formatPrice(i.ListPrice)})
              </Typography>
            ))}
            {offer.Features && <Box sx={{ mt: 2 }} dangerouslySetInnerHTML={{ __html: offer.Features }} />}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        {offer && <Button href={offer.Url} target="_blank" rel="noopener noreferrer">View on Woot</Button>}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
