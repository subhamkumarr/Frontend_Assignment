import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, Typography, Button } from '@mui/material';
import getPlayers from '../utils/get-players';

const PlayerDetails = () => {
  const { id } = useParams();
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    getPlayers().then(players => {
      const currentPlayer = players.find(p => p.id === id);
      setPlayer(currentPlayer);
    });
  }, [id]);

  if (!player) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Button 
        component={Link} 
        to="/" 
        variant="contained" 
        style={{ marginBottom: '20px' }}
      >
        Back to Cricketers
      </Button>
      <Card>
        <CardContent>
          <Typography variant="h4">{player.name}</Typography>
          <Typography variant="body1" paragraph>{player.description}</Typography>
          <Typography variant="body2">Type: {player.type}</Typography>
          <Typography variant="body2">Points: {player.points}</Typography>
          <Typography variant="body2">Rank: {player.rank}</Typography>
          <Typography variant="body2">
            Date of Birth: {new Date(player.dob).toLocaleDateString()}
          </Typography>
          <Typography variant="body2">
            Age: {Math.floor((new Date() - new Date(player.dob)) / (365.25 * 24 * 60 * 60 * 1000))}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerDetails;