/* Simple Notification Animation */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Loading States */
.loading {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  margin: 4rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.error {
  text-align: center;
  color: #e74c3c;
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 15px;
  margin: 2rem auto;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.error h3 {
  margin-bottom: 1rem;
  color: #c0392b;
}

/* Products Header */
.products-header {
  text-align: center;
  margin-bottom: 3rem;
  color: white;
}

.products-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(135deg, #fff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.products-subtitle {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .products-title {
    font-size: 2.2rem;
  }
  
  .products-subtitle {
    font-size: 1.1rem;
  }
  
  .notification-simple {
    right: 10px !important;
    left: 10px !important;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .products-title {
    font-size: 1.8rem;
  }
  
  .products-subtitle {
    font-size: 1rem;
  }
}
