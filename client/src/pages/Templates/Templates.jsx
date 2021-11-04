import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Container,
  Button,
} from '@mui/material';
import TemplateList from '../../components/Template/TemplateList';
import TemplateForm from '../../components/Template/TemplateForm';
import templateService from '../../services/templateService';

const Templates = () => {
  const [templates, setTemplates] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    templateService
      .getAll()
      .then((data) => {
        setTemplates(data);
      });
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h3" align="center" margin={2}>
        Templates
      </Typography>
      {showForm
        ? <TemplateForm setShowForm={setShowForm} />
        : (
          <Button
            fullWidth
            size="large"
            variant="contained"
            onClick={() => setShowForm(true)}
          >
            Create a template
          </Button>
        )}
      <Box container spacing={1}>
        <TemplateList templates={templates} />
      </Box>
    </Container>
  );
};

export default Templates;
