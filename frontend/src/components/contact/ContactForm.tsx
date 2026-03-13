import { useState } from "react";
import {
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    Alert,
    Divider,
    MenuItem,
    Box,
} from "@mui/material";
import { contactService } from "../../services/api";
import { Send } from "lucide-react";

const ContactForm = () => {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        service: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setSuccess(false);
        setError("");

        try {
            await contactService.submit(form);
            setSuccess(true);
            setForm({
                name: "",
                phone: "",
                email: "",
                service: "",
                message: "",
            });
        } catch (err: any) {
            setError("Something went wrong. Please try again.");
            console.log(err);
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    {success && (
                        <Alert severity="success" sx={{ borderRadius: '16px', fontWeight: 600 }}>
                            Thank you! Your inquiry has been received. We will contact you soon.
                        </Alert>
                    )}

                    {error && <Alert severity="error" sx={{ borderRadius: '16px', fontWeight: 600 }}>{error}</Alert>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <TextField
                            label="Full Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="filled"
                            sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', background: '#f8fafc' } }}
                        />
                        <TextField
                            label="Phone Number"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            fullWidth
                            variant="filled"
                            sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', background: '#f8fafc' } }}
                        />
                    </div>

                    <TextField
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="filled"
                        sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', background: '#f8fafc' } }}
                    />

                    <TextField
                        select
                        label="Service Interested In"
                        name="service"
                        value={form.service}
                        onChange={handleChange}
                        required
                        fullWidth
                        variant="filled"
                        sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', background: '#f8fafc' } }}
                    >
                        <MenuItem value="Buy a Car">Buy a Car</MenuItem>
                        <MenuItem value="Sell a Car">Sell a Car</MenuItem>
                        <MenuItem value="Car Inspection">Car Inspection</MenuItem>
                        <MenuItem value="Financing Advice">Financing Advice</MenuItem>
                        <MenuItem value="Service & Maintenance">Service & Maintenance</MenuItem>
                        <MenuItem value="Other">Other Inquiry</MenuItem>
                    </TextField>

                    <TextField
                        label="Message (Optional)"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        variant="filled"
                        sx={{ '& .MuiFilledInput-root': { borderRadius: '12px', background: '#f8fafc' } }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={loading}
                        endIcon={!loading && <Send size={18} />}
                        sx={{
                            py: 2.2,
                            fontWeight: 900,
                            fontSize: "16px",
                            borderRadius: '16px',
                            backgroundColor: "#004e82",
                            textTransform: 'none',
                            transition: 'all 0.3s ease',
                            "&:hover": {
                                backgroundColor: "#003a61",
                                transform: 'translateY(-2px)',
                                boxShadow: '0 20px 40px -10px rgba(0, 78, 130, 0.4)'
                            },
                            boxShadow: 'none'
                        }}
                    >
                        {loading ? "Submitting Request..." : "Send Secure Message"}
                    </Button>
                </Stack>
            </form>
        </div>
    );
};

export default ContactForm;
