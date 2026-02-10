import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, Box } from "@mui/material";
import Header from "../../components/header";
import { roleOptions } from "../../config/staticData";
import Theme from "../../config/theam/index.js";
import IconConfig from "../../components/icon/index.js";

export default function LoginSelection() {
  const navigate = useNavigate();
  const { Shield, UserCog, User, Home, ArrowLeft } = IconConfig;

  const handleRoleSelection = (route) => {
    navigate(route);
  };


  const getIcon = (title) => {
    switch (title) {
      case "Admin":
        return <Shield className="w-12 h-12" />;
      case "Lab Technician":
        return <UserCog className="w-12 h-12" />;
      case "User":
        return <User className="w-12 h-12" />;
      default:
        return <User className="w-12 h-12" />;
    }
  };

  return (
    <div className={Theme.layout.standardPage}>
      <Header hideNavItems={true} />
      
      <main className="flex-grow flex items-center justify-center px-4 py-12 relative">

        <div className="w-full max-w-5xl">
          {/* Header Section */}
          <Box mb={6} textAlign="center">
            <Typography variant="h3" component="h1" fontWeight="bold" sx={{ color: Theme.colors.primary }} mb={2}>
              Welcome to Lab Booking System
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Please select your role to continue
            </Typography>
          </Box>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roleOptions.map((role) => {
              return (
                <Card
                  key={role.id}
                  elevation={4}
                  sx={{
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    backgroundColor: `${Theme.colors[role.lightColor]}20`,
                    border: `2px solid ${Theme.colors[role.primaryColor]}`,
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: 8,
                    },
                  }}
                  onClick={() => handleRoleSelection(role.route)}>
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    {/* Icon */}
                    <Box 
                      mb={3} 
                      display="flex" 
                      justifyContent="center"
                      sx={{ color: Theme.colors[role.primaryColor] }}
                    >
                      {getIcon(role.title)}
                    </Box>

                    {/* Title */}
                    <Typography variant="h5" component="h2" fontWeight="bold" color="text.primary" mb={2}>
                      {role.title}
                    </Typography>

                    {/* Description */}
                    <Typography variant="body2" color="text.secondary" mb={4}>
                      {role.description}
                    </Typography>

                    {/* Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRoleSelection(role.route);
                      }}
                      sx={{
                        backgroundColor: Theme.colors[role.primaryColor],
                        color: "white",
                        py: 1.5,
                        "&:hover": {
                          backgroundColor: Theme.colors.primaryHover,
                        },
                      }}
                    >
                      Login as {role.title}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Footer Note */}
          <Box mt={4} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Button
                onClick={() => navigate("/register")}
                sx={{
                  color: Theme.colors.primary,
                  fontWeight: "bold",
                  textTransform: "none",
                  "&:hover": {
                    textDecoration: "underline",
                    backgroundColor: "transparent",
                  },
                }}
              >
                Register here
              </Button>
            </Typography>
          </Box>
        </div>
      </main>
    </div>
  );
}
