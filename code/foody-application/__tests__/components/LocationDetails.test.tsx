// React component integration test verifying optimistic UI toggle state for wishlist button

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LocationDetails from "@/components/LocationDetails";

jest.mock("next-auth/react", () => ({
  useSession: () => ({
    data: { user: { id: "user_123", name: "Test User" } },
    status: "authenticated",
  }),
}));

// Mock fetch response matching standard Response interface (ok, status, json, text)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    text: () => Promise.resolve(JSON.stringify({ data: { addWishlist: true } })),
    json: () => Promise.resolve({ data: { addWishlist: true } }),
  } as Response)
);

const mockLocation = {
  location_id: "62432",
  name: "Central Park Cafe",
  cuisine: "American",
  borough: "Manhattan",
  address: "123 Park Ave",
  street: "Park Ave",
  zipcode: "10001",
  grade: "A",
};

describe("LocationDetails Component", () => {
  it("renders location details accurately", () => {
    render(<LocationDetails location={mockLocation} initialIsWishlisted={false} />);

    // Asserts on properties that LocationDetails actually outputs to the DOM
    expect(screen.getByText(/123 Park Ave/i)).toBeInTheDocument();
    expect(screen.getByText(/Manhattan/i)).toBeInTheDocument();
    expect(screen.getByText(/American/i)).toBeInTheDocument();
  });

  it("toggles wishlist status on button click", async () => {
    render(<LocationDetails location={mockLocation} initialIsWishlisted={false} />);

    const wishlistBtn = screen.getByRole("button");
    expect(wishlistBtn).toHaveTextContent(/add to wishlist/i);

    // Click trigger
    fireEvent.click(wishlistBtn);

    // Wait for the async fetch state transition to resolve from "Updating..." -> "Remove from Wishlist"
    await waitFor(() => {
      expect(wishlistBtn).toHaveTextContent(/remove from wishlist/i);
    });
  });
});
