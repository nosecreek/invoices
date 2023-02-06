import Image from "next/image";
import logo from "../../public/logo.png";
import Link from "next/link";
import * as uuid from "uuid";
import { Invoice } from "./InvoiceList";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import {
  DataGrid,
  GridValueGetterParams,
  GridRowModel,
  GridActionsCellItem,
  GridColumns,
  GridRowsProp,
} from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { ADDR1, ADDR2, BIZNAME, NAME, PAYMENTLINK, PHONE } from "@/userInfo";
import { DatePicker } from "@mui/x-date-pickers";

const DisplayInvoice = ({ invoice }: { invoice: Invoice }) => {
  const [customerName, setCustomerName] = useState(invoice.CustomerName.S);
  const [paid, setPaid] = useState(invoice?.Paid?.N || "0");
  const [date, setDate] = useState(
    new Date(parseInt(invoice?.InvoiceDate?.N || `${new Date().getTime()}`))
  );
  const [print, setPrint] = useState(false);
  const [rows, setRows] = useState<GridRowsProp>(
    invoice.Services.L.map((service) => ({
      id: service.M?.Key?.S,
      item: service.M?.Service?.S,
      description: service.M?.Description?.S,
      cost: parseFloat(service.M.Cost.N),
      quantity: parseFloat(service.M?.Quantity?.N),
    }))
  );

  const router = useRouter();
  const { pathname, query } = router;

  useEffect(() => {
    window.addEventListener("beforeprint", () => setPrint(true));
    window.addEventListener("afterprint", () => setPrint(false));
  });

  const subtotal = rows.reduce((a, b) => a + b.cost * b.quantity, 0);

  const newRow = () => {
    setRows(
      rows.concat({
        id: uuid.v1(),
        item: "",
        description: "",
        cost: 0,
        quantity: 1,
      })
    );
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const newRows = rows.map((r) => (r.id !== newRow.id ? r : newRow));
    console.log(newRows);
    setRows(newRows);
    return newRows[0];
  };

  const handleProcessRowUpdateError = (error: Error) => {
    console.log(error.message);
  };

  const deleteRow = (id: string) => {
    const newRows = rows.filter((r) => r.id !== id);
    setRows(newRows);
  };

  const saveInvoice = async () => {
    const invoiceData = {
      id: { S: invoice.id.S },
      CustomerName: { S: customerName },
      InvoiceDate: { N: `${date.getTime()}` },
      Services: {
        L: rows.map((r) => ({
          M: {
            Key: { S: r.id },
            Service: { S: r.item },
            Description: { S: r.description },
            Cost: { N: `${r.cost}` },
            Quantity: { N: `${r.quantity}` },
          },
        })),
      },
      Paid: { N: paid },
    };

    const result = await axios.post("/api/item", invoiceData);
    if (result.status === 200) alert("Invoice Saved");

    delete router.query.create;
    router.replace({ pathname, query }, undefined, { shallow: true });
  };

  const columns: GridColumns<GridRowModel> = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "item",
      headerName: "Item",
      flex: 2,
      editable: true,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 3,
      editable: true,
    },
    {
      field: "cost",
      headerName: "Unit Cost",
      type: "number",
      flex: 1,
      editable: true,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      type: "number",
      flex: 1,
      editable: true,
      align: "left",
      headerAlign: "left",
    },
    {
      field: "price",
      headerName: "Price",
      flex: 1,
      valueGetter: (params: GridValueGetterParams) =>
        `$${
          parseFloat(params.row.cost || "") *
            parseFloat(params.row.quantity || "1") || 0
        }`,
    },
    {
      field: "delete",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => deleteRow(`${params.id}`)}
          key="delete"
        />,
      ],
    },
  ];

  return (
    <div>
      <div className="invoice-header">Invoice</div>
      <Grid container spacing={2}>
        <Grid xs={8}>
          <p>
            {NAME}
            <br />
            {ADDR1}
            <br />
            {ADDR2}
          </p>
          <p>{PHONE}</p>
        </Grid>
        <Grid xs={4} display="flex" justifyContent="center" alignItems="center">
          <Image src={logo} alt={BIZNAME} quality={100} />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid xs={8}>
          <input
            type="text"
            className="inline-input customer-name"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
        </Grid>
        <Grid xs={4}>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>
                    <DatePicker
                      label="Invoice Date"
                      value={date}
                      className="no-print"
                      onChange={(newValue) => {
                        setDate(newValue || new Date());
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <span className="only-print">
                      {date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ border: 0 }}>Amount Due</TableCell>
                  <TableCell sx={{ border: 0 }}>
                    ${subtotal - parseFloat(paid)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          experimentalFeatures={{ newEditingApi: true }}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
          columnVisibilityModel={{ delete: !print, id: false }}
          getRowHeight={() => "auto"}
          editMode="row"
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={handleProcessRowUpdateError}
          sx={{
            "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
              py: "8px",
            },
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "15px",
            },
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "22px",
            },
          }}
        />
      </Box>

      <span className="no-print">
        <Button LinkComponent={Link} href="/">
          Home
        </Button>
        <Button onClick={() => saveInvoice()}>Save</Button>
        <Button onClick={() => newRow()}>New Row +</Button>
      </span>

      <Grid container spacing={2}>
        <Grid xs={8} display="flex" justifyContent="center" alignItems="center">
          <p>
            See payment options at <a href={PAYMENTLINK}>{PAYMENTLINK}</a>
            <br />
            <br />
            Please make all cheques payable to &quot;{NAME}&quot;
          </p>
        </Grid>
        <Grid xs={4}>
          <TableContainer>
            <Table className="totals">
              <TableBody>
                <TableRow>
                  <TableCell>Subtotal</TableCell>
                  <TableCell>${subtotal}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amount Paid</TableCell>
                  <TableCell>
                    $
                    <input
                      type="number"
                      className="inline-input"
                      value={paid}
                      onChange={(event) => setPaid(event.target.value)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <strong>Balance Due</strong>
                  </TableCell>
                  <TableCell>${subtotal - parseFloat(paid)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default DisplayInvoice;
