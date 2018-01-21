package waremaster.waremaster;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.support.v4.content.ContextCompat;
import android.support.v4.view.ViewPager;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.AuthFailureError;
import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.auth0.android.jwt.JWT;
import com.google.gson.Gson;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.journeyapps.barcodescanner.CaptureActivity;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;

public class InputProducts extends AppCompatActivity {

    private Button scanProduct, saveProduct;
    private TextView productName;
    private EditText barcode, quantity;
    private JSONObject productObject;
    private JWT decoded;
    private String token, firstName, lastName;
    int companyId, employeeId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_input_products);

        scanProduct = (Button)findViewById(R.id.scanButton);
        saveProduct = (Button)findViewById(R.id.saveButton);
        productName = (TextView)findViewById(R.id.productNameView);
        barcode = (EditText)findViewById(R.id.barcodeEditText);
        quantity = (EditText)findViewById(R.id.quantityEditText);

        saveProduct.setEnabled(false);
        token = getIntent().getStringExtra("waremasterToken");
        decoded = new JWT(token);
        companyId = Integer.parseInt(decoded.getClaim("companyid").asString());
        employeeId = Integer.parseInt(decoded.getClaim("id").asString());
        firstName = decoded.getClaim("firstname").asString();
        lastName = decoded.getClaim("lastname").asString();

        scanProduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (ContextCompat.checkSelfPermission(InputProducts.this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED)
                    ActivityCompat.requestPermissions(InputProducts.this, new String[]{Manifest.permission.CAMERA}, 0);
                else
                    scanNow(view);
            }
        });

        saveProduct.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                try {
                    productObject.put("Barcode", barcode.getText().toString());
                    productObject.put("Counter", Integer.parseInt(quantity.getText().toString()));
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                StringRequest editProductRequest = new StringRequest(Request.Method.POST, getString(R.string.base_url) + "/products/edit",
                        new Response.Listener<String>() {
                            @Override
                            public void onResponse(String product) {
                                AddActivityLog.Add(employeeId, companyId,
                                        firstName + " " + lastName + " (Zaposlenik) je uredio proizvod " +
                                         productName.getText().toString(), token, getApplicationContext());
                                productName.setText("");
                                barcode.setText("");
                                quantity.setText("");
                                saveProduct.setEnabled(false);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        if(error.networkResponse.statusCode == 403)
                            Toast.makeText(getApplicationContext(), "Već postoji proizvod s tim barkodom!", Toast.LENGTH_LONG).show();
                        else
                            Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }){
                    @Override
                    public Map<String, String> getHeaders() throws AuthFailureError {
                        Map<String, String>  authParams = new HashMap<>();

                        authParams.put("Authorization", "Bearer " + token);
                        return authParams;
                    }
                    @Override
                    public byte[] getBody() throws AuthFailureError {
                        return productObject.toString().getBytes();
                    }
                    @Override
                    public String getBodyContentType() {
                        return "application/json";
                    }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(editProductRequest);
            }
        });
    }

    public void scanNow(View view){
        IntentIntegrator integrator = new IntentIntegrator(InputProducts.this);
        integrator.setCaptureActivity(AnyOrientationCaptureActivity.class);
        integrator.setOrientationLocked(false);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.ONE_D_CODE_TYPES);
        integrator.setPrompt(getString(R.string.scan_bar_code));
        integrator.setCameraId(0);
        integrator.setBarcodeImageEnabled(true);
        integrator.initiateScan();
    }

    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        IntentResult scanningResult = IntentIntegrator.parseActivityResult(requestCode, resultCode, intent);

        if (scanningResult != null)
        {
            if(scanningResult.getContents() != null)
            {
                JsonObjectRequest getProductRequest = new JsonObjectRequest(Request.Method.GET, getString(R.string.base_url) + "/products/get?barcode="
                        + scanningResult.getContents() + "&companyId=" + companyId, null,
                        new Response.Listener<JSONObject>() {
                            @Override
                            public void onResponse(JSONObject product) {
                                productObject = product;
                                productName.setText(product.optString("Name"));
                                barcode.setText(product.optString("Barcode"));
                                quantity.setText(product.optString("Counter"));
                                saveProduct.setEnabled(true);
                            }
                        }, new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        int httpStatusCode = error.networkResponse.statusCode;
                        if(httpStatusCode == 404)
                            Toast.makeText(getApplicationContext(), "Proizvod s tim barkodom ne postoji.", Toast.LENGTH_LONG).show();
                        else
                            Toast.makeText(getApplicationContext(), "Došlo je do neočekivane pogreške: " + error.toString(), Toast.LENGTH_LONG).show();
                    }
                }){
                    @Override
                    public Map<String, String> getHeaders() throws AuthFailureError {
                        Map<String, String>  params = new HashMap<String, String>();
                        params.put("Authorization", "Bearer " + token);
                        return params;
                    }
                };
                RequestQueueSingleton.getInstance(getApplicationContext()).addToRequestQueue(getProductRequest);
            }
            else
                Toast.makeText(this, "Otkazano", Toast.LENGTH_LONG).show();
        }
        else
            Toast.makeText(getApplicationContext(),"Nisu dobiveni podaci o skeniranju.", Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED)
                    scanNow(findViewById(R.id.scanButton));
                else
                    Toast.makeText(getApplicationContext(), "Skener ne može raditi bez pristupa kameri!", Toast.LENGTH_LONG).show();
                return;
            }
}
