import React from 'react';
import { Card, CardContent, Skeleton, Box } from '@mui/material';

const SkeletonList = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ mb: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Skeleton variant="text" width={100} height={20} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="75%" height={32} sx={{ mb: 2 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="100%" height={20} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="45%" height={20} sx={{ mb: 3 }} />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Skeleton variant="rounded" width={60} height={28} />
              <Skeleton variant="rounded" width={80} height={28} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default SkeletonList;
