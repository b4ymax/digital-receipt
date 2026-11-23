@php use Illuminate\Support\Carbon; @endphp
    <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Digital Receipt</title>

    <style>
        body {
            font-family: Arial, sans-serif;
            color: #333;
            font-size: 13px;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            margin-bottom: 5px;
            font-size: 24px;
        }

        .receipt-info {
            margin-bottom: 25px;
        }

        .items {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
        }

        .items th,
        .items td {
            padding: 10px 8px;
            border-bottom: 1px solid #ddd;
            text-align: left;
        }

        .items th:last-child,
        .items td:last-child {
            text-align: right;
        }

        .summary {
            width: 100%;
            margin-top: 20px;
        }

        .summary td {
            padding: 6px 0;
        }

        .summary td:last-child {
            text-align: right;
        }

        .total {
            font-size: 17px;
            font-weight: bold;
            border-top: 2px solid #333;
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            color: #777;
        }
    </style>
</head>
<body>

<div class="header">
    <h1>Digital Receipt</h1>
    <p>Your purchase details</p>
</div>

<div class="receipt-info">
    <strong>Receipt Number:</strong>
    {{ $receipt->receipt_number }}

    <br>

    <strong>Purchase Date:</strong>
    {{ Carbon::parse($receipt->purchased_at)->format('d/m/Y h:i A') }}
</div>

<h3>Purchased Items</h3>

<table class="items">
    <thead>
    <tr>
        <th>Product</th>
        <th>Quantity</th>
        <th>Unit Price</th>
        <th>Subtotal</th>
    </tr>
    </thead>

    <tbody>
    @foreach ($receipt->items as $item)
        <tr>
            <td>{{ $item->product_name }}</td>
            <td>{{ $item->quantity }}</td>
            <td>{{ number_format($item->unit_price, 2) }}</td>
            <td>{{ number_format($item->subtotal, 2) }}</td>
        </tr>
    @endforeach
    </tbody>
</table>

<table class="summary">
    <tr>
        <td>Subtotal</td>
        <td>{{ number_format($receipt->subtotal, 2) }}</td>
    </tr>

    <tr>
        <td>Tax</td>
        <td>{{ number_format($receipt->tax, 2) }}</td>
    </tr>

    <tr class="total">
        <td>Total</td>
        <td>{{ number_format($receipt->total, 2) }}</td>
    </tr>
</table>

<div class="footer">
    <p>Thank you for your purchase!</p>
    <p>This is a computer-generated receipt.</p>
</div>

</body>
</html>
