import { Box, Container, Typography } from '@mui/material';

interface PageHeroProps {
    title: string;
    subtitle?: string;
}

const PageHero = ({ title, subtitle }: PageHeroProps) => {
    return (
        <Box
            sx={{
                background: 'linear-gradient(135deg, #004e82 0%, #0070f3 100%)',
                color: 'white',
                py: { xs: 10, md: 14 },
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Abstract Pattern overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.1,
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.83L40 15.458 24.542 0h-4.084L35.916 15.458 20.458 30.916V35L0 14.542V10.458L10.458 0h4.084L0 14.542V18.625l20.458 20.458V45L0 24.542v-4.084L14.542 60h4.084L0 45.458V49.542l10.458 10.458h4.084L0 60h4.084L20.458 39.542V35L40 54.542V60h4.084L30.916 46.833 46.833 30.916 60 44.084v-4.084L46.833 26.833 60 13.667v-4.084L46.833 22.75 30.916 6.833 44.084 0h-4.084L24.542 15.458 40 30.916 55.458 15.458 40 0h4.084zM60 20.458V24.542L49.542 35 60 45.458v4.084L45.458 60h-4.084L55.916 45.458 40.458 30.916V26.833L60 6.542V2.458L49.542 12.916 39.084 2.458 28.625 12.916 18.167 2.458 7.708 12.916 0 5.208V1.125l7.708 7.708L18.167 0h4.084L11.792 10.458 22.25 20.916 32.708 10.458 43.167 20.916 53.625 10.458 60 16.833V20.458z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, letterSpacing: '-1px', fontSize: { xs: '3rem', md: '4rem' } }}>
                    {title}
                </Typography>
                {subtitle && (
                    <Typography variant="h5" sx={{ opacity: 0.9, maxWidth: '700px', fontWeight: 500 }}>
                        {subtitle}
                    </Typography>
                )}
            </Container>
        </Box>
    );
};

export default PageHero;
