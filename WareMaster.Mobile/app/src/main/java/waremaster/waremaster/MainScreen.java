package waremaster.waremaster;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class MainScreen extends AppCompatActivity {

    private Button inputProducts, outgoingOrders, incomingOrders, activityLogs;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_screen);

        Intent intent = getIntent();
        final String token = intent.getStringExtra("waremasterToken");

        inputProducts = (Button)findViewById(R.id.inputProductsButton);
        outgoingOrders = (Button)findViewById(R.id.outgoingOrdersButton);
        incomingOrders = (Button)findViewById(R.id.incomingOrdersButton);
        activityLogs = (Button)findViewById(R.id.activityLogsButton);

        inputProducts.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent goToProducts = new Intent(view.getContext(), InputProducts.class);
                goToProducts.putExtra("waremasterToken", token);
                startActivity(goToProducts);
            }
        });

        outgoingOrders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent goToOutgoingOrdersList = new Intent(view.getContext(), OutgoingOrdersList.class);
                goToOutgoingOrdersList.putExtra("waremasterToken", token);
                startActivity(goToOutgoingOrdersList);
            }
        });

        incomingOrders.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent goToIncomingOrders = new Intent(view.getContext(), IncomingOrders.class);
                goToIncomingOrders.putExtra("waremasterToken", token);
                startActivity(goToIncomingOrders);
            }
        });

        activityLogs.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent goToActivityLogs = new Intent(view.getContext(), ActivityLogs.class);
                goToActivityLogs.putExtra("waremasterToken", token);
                startActivity(goToActivityLogs);
            }
        });
    }
}
